using com.vorwardit.jollyapp.cms.Models;
using com.vorwardit.jollyapp.cms.Modules.Core;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Modules
{
	public class ContentModel
	{
		[AllowHtml]
		[DataType(DataType.MultilineText)]
		public string Content { get; set; }
	}

	[Module("HTML Content")]
	public class ContentController : Controller, IModule
	{
		public ApplicationDbContext db = new ApplicationDbContext();

		// GET: TopBanner
		public ActionResult Index(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
			var model = new ContentModel();
			if (moduledata != null)
			{
				model.Content = moduledata.Data.Content;
			}
			return Content(model.Content, "text/html");
		}

		public ActionResult Edit(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
			var model = new ContentModel();
			if (moduledata != null)
			{
				model.Content = moduledata.Data.Content;
			}
			return PartialView("~/Views/Content/Edit.cshtml", model);
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
					thisModule.Data.Content = form["Content"];
					pageVersion.ModuleData = moduledata;
				}
			}
			db.SaveChanges();
			return Content("ok");
		}
	}
}