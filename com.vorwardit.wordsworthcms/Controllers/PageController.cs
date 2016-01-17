using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public class PageController : Controller
    {
        ISiteService siteService;
        IPageService pageService;
        IContentService contentService;

        public PageController(ISiteService siteService, IPageService pageService, IContentService contentService)
        {
            this.siteService = siteService;
            this.pageService = pageService;
            this.contentService = contentService;
        }

        // GET: Page
        public async Task<ActionResult> Index(string pathinfo)
        {
            var currentSite = await siteService.GetByHostnameAsync(Request.Url.DnsSafeHost);

            if (currentSite == null)
			{
				return HttpNotFound();
			}

            var pageVersion = await pageService.GetLatestPublishedVersionAsync(currentSite.SiteId, pathinfo);

            if (pageVersion == null)
            {
                return await getContent(pathinfo);
            }

            return View($"/db/{pageVersion.PageVersionId.ToString()}.cshtml");
        }

		[NonAction]
		public async Task<ActionResult> NotFound()
		{
            var currentSite = await siteService.GetByHostnameAsync(Request.Url.DnsSafeHost);

            if (currentSite == null)
            {
                return HttpNotFound();
            }

            var pageVersion = await pageService.GetErrorPageAsync(currentSite.SiteId, 404);

            if (pageVersion == null)
            {
                return HttpNotFound();
            }

			Response.StatusCode = 404;
			return View($"/db/{pageVersion.PageVersionId.ToString()}.cshtml");
		}

		public async Task<ActionResult> Preview(Guid id)
        {
            var pageversion = await pageService.GetPageVersionAsync(id);
            if (pageversion == null)
            {
                return HttpNotFound();
            }
            return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
        }

        public async Task<ActionResult> Edit(Guid id)
        {
            var pageversion = await pageService.GetPageVersionAsync(id);
            if (pageversion == null)
            {
                return HttpNotFound();
            }
            return View($"/db/edit/{pageversion.PageVersionId.ToString()}.cshtml");
        }

        [NonAction]
        public async Task<ActionResult> getContent(string path)
        {
            var currentSite = await siteService.GetByHostnameAsync(Request.Url.DnsSafeHost);
            var content = await contentService.GetAsync(currentSite.SiteId, path);
            if (content == null)
            {
				return await NotFound();
			}
			string mimetype = "text/html";
            if (content.Url.EndsWith("css"))
            {
                mimetype = "text/css";
            }
            else if (content.Url.EndsWith("js"))
            {
                mimetype = "application/javascript";
            }
            return Content(content.Body, mimetype);
        }
    }
}