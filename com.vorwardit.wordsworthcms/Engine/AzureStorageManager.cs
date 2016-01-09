using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Threading.Tasks;
using System.IO;
using System.Web.Configuration;

namespace com.vorwardit.wordsworthcms.Engine
{
    public class AzureStorageManager
    {
        CloudBlobContainer mContainer;

        public AzureStorageManager()
        {
            var storageAccount = CloudStorageAccount.Parse(WebConfigurationManager.ConnectionStrings["AzureStorageConnectionString"].ConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var folder = WebConfigurationManager.AppSettings["AzureStorageFolder"] ?? "wordsworthcms";
            mContainer = blobClient.GetContainerReference(folder);
        }

        public IEnumerable<Uri> ListFiles(string directory)
        {
            var dir = mContainer.GetDirectoryReference(directory);
            foreach (var item in dir.ListBlobs())
            {
                yield return item.Uri;
            }
        }

        public async Task SaveFile(string directory, string name, Stream data, string contentType)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            blockBlob.Properties.ContentType = contentType;
            await blockBlob.UploadFromStreamAsync(data);
            await blockBlob.SetPropertiesAsync();
        }

        public async Task<string> GetFile(string directory, string name, Stream data)
        {
            string contentType = "";
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            if (blockBlob.Exists())
            {
                contentType = blockBlob.Properties.ContentType;
                await blockBlob.DownloadToStreamAsync(data);
            }
            return contentType;
        }

        public async Task DeleteFile(string directory, string name)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            await blockBlob.DeleteIfExistsAsync();
        }
    }
}