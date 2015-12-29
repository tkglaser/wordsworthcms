using com.vorwardit.jollyapp.cms.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.API
{
    public class AssetUploadModel
    {
        public HttpPostedFileBase File { get; set; }
    }

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