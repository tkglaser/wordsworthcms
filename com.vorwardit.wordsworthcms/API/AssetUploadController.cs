using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
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
        public Guid SiteId { get; set; }
        public HttpPostedFileBase File { get; set; }
    }

    [Authorize]
    public class AssetUploadController : Controller
    {
        IAzureStorageService storageService;

        public AssetUploadController(IAzureStorageService storageService)
        {
            this.storageService = storageService;
        }

        [HttpPost]
        public async Task<ActionResult> SaveAsset(AssetUploadModel model)
        {
            if (model.File != null)
            {
                await storageService.SaveFileAsync(model.SiteId.ToString(), model.File.FileName, model.File.InputStream, model.File.ContentType);
            }
            return Json("Saved", JsonRequestBehavior.AllowGet);
        }
    }
}