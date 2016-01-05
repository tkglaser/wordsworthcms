using com.vorwardit.jollyapp.cms.Models;
using com.vorwardit.jollyapp.cms.Modules.Core;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Modules
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
        public ApplicationDbContext db = new ApplicationDbContext();

        // GET: TopBanner
        public ActionResult Index(Guid pageVersionId, string position)
        {
            var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule<ImageBannerModel>(position);
			return PartialView("~/Views/ImageBanner/Index.cshtml", md.Data);
        }

		public ActionResult Edit(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule<ImageBannerModel>(position);
			return PartialView("~/Views/ImageBanner/Edit.cshtml", md.Data);
		}

		public ActionResult Save(Guid pageVersionId, string position, NameValueCollection form)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule<ImageBannerModel>(position);
			md.Data.Heading = form["Heading"];
			md.Data.SubHeading = form["SubHeading"];
			md.Data.Image = form["Image"];
			pageVersion.SetModule(position, md);
			db.SaveChanges();
			return Content("ok");
		}
	}
}