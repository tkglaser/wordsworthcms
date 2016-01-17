using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.Modules.Core;
using MarkdownSharp;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
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
        IPageService pageService;

        public MarkdownController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        // GET: TopBanner
        public ActionResult Index(Guid pageVersionId, string position)
        {
            Markdown mark = new Markdown();
            var pageVersion = pageService.GetPageVersion(pageVersionId);
            var md = pageVersion.GetModule<MarkdownModel>(position);
            return Content(mark.Transform(md.Data.Content), "text/html");
        }

        public async Task<ActionResult> Edit(Guid pageVersionId, string position)
        {
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<MarkdownModel>(position);
            return PartialView("~/Views/Markdown/Edit.cshtml", md.Data);
        }

        [ValidateInput(false)]
        public async Task<ActionResult> Save(Guid pageVersionId, string position, NameValueCollection form)
        {
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<MarkdownModel>(position);
            md.Data.Content = form["Content"];
            pageVersion.SetModule(position, md);
            await pageService.UpdateAsync(pageVersion);
            return Content("ok");
        }
    }
}