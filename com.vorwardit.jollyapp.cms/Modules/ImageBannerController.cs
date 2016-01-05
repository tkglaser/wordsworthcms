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
            var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
            var model = new ImageBannerModel();
            if (moduledata != null)
            {
                model.Heading = moduledata.Data.Heading;
                model.SubHeading = moduledata.Data.SubHeading;
            }
            return PartialView("~/Views/ImageBanner/Index.cshtml", model);
        }

		public ActionResult Edit(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
			var model = new ImageBannerModel();
			if (moduledata != null)
			{
				model.Heading = moduledata.Data.Heading;
				model.SubHeading = moduledata.Data.SubHeading;
			}
			return PartialView("~/Views/ImageBanner/Edit.cshtml", model);
		}

		public ActionResult Save(Guid pageVersionId, string position, NameValueCollection form)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData;
			if (moduledata != null)
			{
				var thisModule = moduledata.FirstOrDefault(md => md.Position == position);
				if (thisModule != null)
				{
					thisModule.Data.Heading = form["Heading"];
					thisModule.Data.SubHeading = form["SubHeading"];
					pageVersion.ModuleData = moduledata;
				}
			}
			db.SaveChanges();
			return Content("ok");
		}
	}
}