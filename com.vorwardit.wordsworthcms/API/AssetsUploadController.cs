using com.vorwardit.wordsworthcms.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.API
{
    public class AssetUploadModel
    {
        public HttpPostedFileBase File { get; set; }
    }

    [Authorize]
    public class AssetsUploadController : Controller
    {
        AzureStorageManager storage = new AzureStorageManager();

        [HttpPost]
        public async Task<ActionResult> SaveAsset(AssetUploadModel model)
        {
            if (model.File != null)
            {
                await storage.SaveFile(model.File.FileName, model.File.InputStream);
            }
            return Json("Saved", JsonRequestBehavior.AllowGet);
        }
    }
}