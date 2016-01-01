using com.vorwardit.jollyapp.cms.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.jollyapp.cms.API
{
    [RoutePrefix("api/assets")]
    public class AssetsController : ApiController
    {
        AzureStorageManager storage = new AzureStorageManager();

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            var result = from f in storage.ListFiles()
                         select new
                         {
                             name = System.IO.Path.GetFileName(f.LocalPath),
                             uri = f
                         };
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(string name)
        {
            await storage.DeleteFile(name);
            return Ok();
        }
    }
}
