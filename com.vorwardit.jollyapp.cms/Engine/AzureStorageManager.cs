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

namespace com.vorwardit.jollyapp.cms.Engine
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

        public IEnumerable<Uri> ListFiles()
        {
            foreach (var item in mContainer.ListBlobs())
            {
                yield return item.Uri;
            }
        }

        public async Task SaveFile(string name, Stream data)
        {
            var blockBlob = mContainer.GetBlockBlobReference(name);
            await blockBlob.UploadFromStreamAsync(data);
        }

        public async Task GetFile(string name, Stream data)
        {
            var blockBlob = mContainer.GetBlockBlobReference(name);
            if (blockBlob.Exists())
            {
                await blockBlob.DownloadToStreamAsync(data);
            }
        }

        public async Task DeleteFile(string name)
        {
            var blockBlob = mContainer.GetBlockBlobReference(name);
            await blockBlob.DeleteIfExistsAsync();
        }
    }
}