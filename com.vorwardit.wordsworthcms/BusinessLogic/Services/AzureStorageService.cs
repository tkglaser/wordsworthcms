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
using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Services
{
    public class AzureStorageService : IAzureStorageService
    {
        CloudBlobContainer mContainer;

        public AzureStorageService()
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

        public async Task SaveFileAsync(string directory, string name, Stream data, string contentType)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            blockBlob.Properties.ContentType = contentType;
            await blockBlob.UploadFromStreamAsync(data);
            await blockBlob.SetPropertiesAsync();
        }

        public async Task<string> GetFileAsync(string directory, string name, Stream data)
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

        public async Task DeleteFileAsync(string directory, string name)
        {
            var blockBlob = mContainer.GetBlockBlobReference(directory + "/" + name);
            await blockBlob.DeleteIfExistsAsync();
        }
    }
}