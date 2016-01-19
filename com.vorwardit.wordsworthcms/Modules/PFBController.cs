using com.vorwardit.wordsworthcms.Modules.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Specialized;
using System.Threading.Tasks;
using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;

namespace com.vorwardit.wordsworthcms.Modules
{
    public class PFBModel
    {
        public string APIEndpoint { get; set; }
        public string ClientId { get; set; }
    }

    [Module("Paul fährt Bus Plugin")]
    public class PFBController : Controller, IModule
    {
        IPageService pageService;

        public PFBController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        public ActionResult Index(Guid pageVersionId, string position)
        {
            var pageVersion = pageService.GetPageVersion(pageVersionId);
            var md = pageVersion.GetModule<PFBModel>(position);
            return PartialView("~/Views/PFB/Index.cshtml", md.Data);
        }

        public async Task<ActionResult> Edit(Guid pageVersionId, string position)
        {
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<PFBModel>(position);
            return PartialView("~/Views/PFB/Edit.cshtml", md.Data);
        }

        public async Task<ActionResult> Save(Guid pageVersionId, string position, NameValueCollection form)
        {
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule<PFBModel>(position);
            md.Data.APIEndpoint = form["APIEndpoint"];
            md.Data.ClientId = form["ClientId"];
            pageVersion.SetModule(position, md);
            await pageService.UpdateAsync(pageVersion);
            return Content("ok");
        }
    }
}