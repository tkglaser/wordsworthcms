using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface IAzureStorageService
    {
        IEnumerable<Uri> ListFiles(string directory);

        Task SaveFileAsync(string directory, string name, Stream data, string contentType);

        Task<string> GetFileAsync(string directory, string name, Stream data);

        Task DeleteFileAsync(string directory, string name);
    }
}
