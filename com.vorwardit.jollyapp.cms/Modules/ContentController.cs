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
			var md = pageVersion.GetModule(position);
			var model = new ContentModel();
			if (md != null)
			{
				try
				{
					model.Content = md.Data.Content;
				}
				catch
				{ }
			}
			return Content(model.Content, "text/html");
		}

		public ActionResult Edit(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			var model = new ContentModel();
			if (md != null)
			{
				try
				{
					model.Content = md.Data.Content;
				}
				catch
				{ }
			}
			return PartialView("~/Views/Content/Edit.cshtml", model);
		}

		public ActionResult Save(Guid pageVersionId, string position, NameValueCollection form)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			md.Data = new ContentModel
			{
				Content = form["Content"]
			};
			pageVersion.SetModule(position, md);
			db.SaveChanges();
			return Content("ok");
		}
	}
}