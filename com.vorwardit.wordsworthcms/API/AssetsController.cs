using com.vorwardit.wordsworthcms.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/assets")]
    public class AssetsController : ApiController
    {
        AzureStorageManager storage = new AzureStorageManager();

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid siteId)
        {
            var result = from f in storage.ListFiles(siteId.ToString())
                         select new
                         {
                             name = System.IO.Path.GetFileName(f.LocalPath),
                             uri = f
                         };
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid siteId, string name)
        {
            await storage.DeleteFile(siteId.ToString(), name);
            return Ok();
        }
    }
}
