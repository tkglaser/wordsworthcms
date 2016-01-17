using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.Modules.Core;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Modules
{
    public class ImageModel
    {
		public string Image { get; set; }
    }

	[Module("Image")]
    public class ImageController : Controller, IModule
	{
        IPageService pageService;

        public ImageController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        // GET: TopBanner
        public ActionResult Index(Guid pageVersionId, string position)
        {
            var pageVersion = pageService.GetPageVersion(pageVersionId);
            var md = pageVersion.GetModule<ImageModel>(position);
			return PartialView("~/Views/Image/Index.cshtml", md.Data);
        }

		public async Task<ActionResult> Edit(Guid pageVersionId, string position)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<ImageModel>(position);
			return PartialView("~/Views/Image/Edit.cshtml", md.Data);
		}

		public async Task<ActionResult> Save(Guid pageVersionId, string position, NameValueCollection form)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<ImageModel>(position);
			md.Data.Image = form["Image"];
			pageVersion.SetModule(position, md);
            await pageService.UpdateAsync(pageVersion);
            return Content("ok");
		}
	}
}