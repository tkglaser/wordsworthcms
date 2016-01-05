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
			var md = pageVersion.GetModule(position);
			var model = new ImageModel();

			try
			{
				model.Image = md.Data.Image;
			}
			catch
			{

			}

			return PartialView("~/Views/Image/Index.cshtml", model);
        }

		public ActionResult Edit(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			var model = new ImageModel();
			try
			{
				model.Image = md.Data.Image;
			}
			catch
			{

			}
			return PartialView("~/Views/Image/Edit.cshtml", model);
		}

		public ActionResult Save(Guid pageVersionId, string position, NameValueCollection form)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			md.Data = new ImageModel
			{
				Image = form["Image"]
			};
			pageVersion.SetModule(position, md);
			db.SaveChanges();
			return Content("ok");
		}
	}
}