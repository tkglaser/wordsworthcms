using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
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
    [RoutePrefix("api/asset")]
    public class AssetController : ApiController
    {
        IAzureStorageService storageService;

        public AssetController(IAzureStorageService storageService)
        {
            this.storageService = storageService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid siteId)
        {
            var result = from f in storageService.ListFiles(siteId.ToString())
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
            await storageService.DeleteFileAsync(siteId.ToString(), name);
            return Ok();
        }
    }
}
