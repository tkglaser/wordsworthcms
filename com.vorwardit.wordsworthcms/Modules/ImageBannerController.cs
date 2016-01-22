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
    public class ImageBannerModel
    {
		public string Image { get; set; }
        public string Heading { get; set; }
        public string SubHeading { get; set; }
    }

	[Module("Image Banner")]
    public class ImageBannerController : Controller, IModule
	{
        IPageService pageService;

        public ImageBannerController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        public ActionResult Index(Guid pageVersionId, string position, bool editorPreview)
        {
            var pageVersion = pageService.GetPageVersion(pageVersionId);
            var md = pageVersion.GetModule<ImageBannerModel>(position);
			return PartialView("~/Views/ImageBanner/Index.cshtml", md.Data);
        }

		public async Task<ActionResult> Edit(Guid pageVersionId, string position)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<ImageBannerModel>(position);
			return PartialView("~/Views/ImageBanner/Edit.cshtml", md.Data);
		}

		public async Task<ActionResult> Save(Guid pageVersionId, string position, NameValueCollection form)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<ImageBannerModel>(position);
			md.Data.Heading = form["Heading"];
			md.Data.SubHeading = form["SubHeading"];
			md.Data.Image = form["Image"];
			pageVersion.SetModule(position, md);
            await pageService.UpdateAsync(pageVersion);
            return Content("ok");
		}
	}
}