using com.vorwardit.wordsworthcms.Engine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public class AssetsController : BaseController
    {
        AzureStorageManager storage = new AzureStorageManager();

        // GET: Assets
        public async Task<ActionResult> Index(string name)
        {
            if (CurrentSite == null)
            {
                return HttpNotFound();
            }

            Stream result = new MemoryStream();
            string contentType = await storage.GetFile(CurrentSite.SiteId.ToString(), name, result);
            result.Seek(0, SeekOrigin.Begin);
            return File(result, contentType);
        }
    }
}