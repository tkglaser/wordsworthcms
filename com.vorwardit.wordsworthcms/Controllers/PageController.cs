using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public class PageController : BaseController
    {
        // GET: Page
        public async Task<ActionResult> Index(string pathinfo)
        {
			if (CurrentSite == null)
			{
				return await NotFound();
			}

			var path = "/" + pathinfo;

            var page = await (from url in db.PageUrls
                              where url.Url == path
                              where url.Page.PageLayout.Layout.SiteId == CurrentSite.SiteId
                              select url.Page).FirstOrDefaultAsync();
            if (page == null)
            {
                return await getContent(path);
            }
            var pageversion = (from pv in page.Versions
                               where pv.Status == Models.PageVersionStatus.Published
                               orderby pv.RevisionNumber descending
                               select pv).FirstOrDefault();
            if (pageversion == null)
            {
                return await NotFound();
            }
            return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
        }

		[NonAction]
		public async Task<ActionResult> NotFound()
		{
			if (CurrentSite == null)
			{
				return HttpNotFound();
			}

			var path = "/errors/404";

			var page = await (from url in db.PageUrls
							  where url.Url == path
							  where url.Page.PageLayout.Layout.SiteId == CurrentSite.SiteId
							  select url.Page).FirstOrDefaultAsync();
			if (page == null)
			{
				return HttpNotFound();
			}
			var pageversion = (from pv in page.Versions
							   where pv.Status == Models.PageVersionStatus.Published
							   orderby pv.RevisionNumber descending
							   select pv).FirstOrDefault();
			if (pageversion == null)
			{
				return HttpNotFound();
			}

			Response.StatusCode = 404;
			return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
		}

		public async Task<ActionResult> Preview(Guid id)
        {
            var pageversion = await db.PageVersions.FindAsync(id);
            if (pageversion == null)
            {
                return HttpNotFound();
            }
            return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
        }

        public async Task<ActionResult> Edit(Guid id)
        {
            var pageversion = await db.PageVersions.FindAsync(id);
            if (pageversion == null)
            {
                return HttpNotFound();
            }
            return View($"/db/edit/{pageversion.PageVersionId.ToString()}.cshtml");
        }

        [NonAction]
        public async Task<ActionResult> getContent(string path)
        {
			var content = await (from c in db.Contents
								 where c.Url == path
								 where c.SiteId == CurrentSite.SiteId
								 select c).FirstOrDefaultAsync();
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