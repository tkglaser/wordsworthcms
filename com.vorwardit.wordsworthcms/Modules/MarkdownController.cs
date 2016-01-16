using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.Modules.Core;
using MarkdownSharp;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Modules
{
    public class MarkdownModel
    {
        [AllowHtml]
        [DataType(DataType.MultilineText)]
        public string Content { get; set; }
    }

    [Module("Markdown")]
    public class MarkdownController : Controller, IModule
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        // GET: TopBanner
        public ActionResult Index(Guid pageVersionId, string position)
        {
            Markdown mark = new Markdown();
            var pageVersion = db.PageVersions.Find(pageVersionId);
            var md = pageVersion.GetModule<ContentModel>(position);
            return Content(mark.Transform(md.Data.Content), "text/html");
        }

        public ActionResult Edit(Guid pageVersionId, string position)
        {
            var pageVersion = db.PageVersions.Find(pageVersionId);
            var md = pageVersion.GetModule<ContentModel>(position);
            return PartialView("~/Views/Markdown/Edit.cshtml", md.Data);
        }

        [ValidateInput(false)]
        public ActionResult Save(Guid pageVersionId, string position, NameValueCollection form)
        {
            var pageVersion = db.PageVersions.Find(pageVersionId);
            var md = pageVersion.GetModule<ContentModel>(position);
            md.Data.Content = form["Content"];
            pageVersion.SetModule(position, md);
            db.SaveChanges();
            return Content("ok");
        }
    }
}