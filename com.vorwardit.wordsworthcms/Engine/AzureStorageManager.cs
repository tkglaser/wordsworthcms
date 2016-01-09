using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Threading.Tasks;
using System.IO;

namespace com.vorwardit.wordsworthcms.Engine
{
    public class AzureStorageManager
    {
        CloudBlobContainer mContainer;

        public AzureStorageManager()
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["AzureStorageConnectionString"].ConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            mContainer = blobClient.GetContainerReference("jollycmsassets");
        }

        public IEnumerable<Uri> ListFiles(string directory)
        {
            var dir = mContainer.GetDirectoryReference(directory);
            foreach (var item in dir.ListBlobs())
            {
                yield return item.Uri;
            }
        }

        public async Task SaveFile(string directory, string name, Stream data)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            await blockBlob.UploadFromStreamAsync(data);
        }

        public async Task GetFile(string directory, string name, Stream data)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            if (blockBlob.Exists())
            {
                await blockBlob.DownloadToStreamAsync(data);
            }
        }

        public async Task DeleteFile(string directory, string name)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            await blockBlob.DeleteIfExistsAsync();
        }
    }
}