using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Controllers
{
    public class PageController : BaseController
    {
        // GET: Page
        public async Task<ActionResult> Index(string pathinfo)
        {
            var path = "/" + pathinfo;

            var page = await (from url in db.PageUrls
                              where url.Url == path
                              where url.Page.SiteId == CurrentSite.SiteId
                              select url.Page).FirstOrDefaultAsync();
            if (page == null)
            {
                return getContent(path);
            }
            var pageversion = (from pv in page.Versions
                               where pv.Status == Models.PageVersionStatus.Published
                               orderby pv.RevisionNumber descending
                               select pv).FirstOrDefault();
            if (pageversion == null)
            {
                return HttpNotFound();
            }
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
        public ActionResult getContent(string path)
        {
            var content = (from c in db.Contents
                           where c.Url == path
                           where c.SiteId == CurrentSite.SiteId
                           select c).FirstOrDefault();
            if (content == null)
            {
                return HttpNotFound();
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