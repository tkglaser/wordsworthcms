using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.Modules.Core;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
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
        public ApplicationDbContext db = new ApplicationDbContext();

        // GET: TopBanner
        public ActionResult Index(Guid pageVersionId, string position)
        {
            var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule<ImageModel>(position);
			return PartialView("~/Views/Image/Index.cshtml", md.Data);
        }

		public ActionResult Edit(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule<ImageModel>(position);
			return PartialView("~/Views/Image/Edit.cshtml", md.Data);
		}

		public ActionResult Save(Guid pageVersionId, string position, NameValueCollection form)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule<ImageModel>(position);
			md.Data.Image = form["Image"];
			pageVersion.SetModule(position, md);
			db.SaveChanges();
			return Content("ok");
		}
	}
}