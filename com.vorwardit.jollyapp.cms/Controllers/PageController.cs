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
            if (path.StartsWith("/preview/"))
            {
                var guidStr = path.Replace("/preview/", "");
                Guid versionId;
                if (Guid.TryParse(guidStr, out versionId))
                {
                    return await getPreview(versionId);
                }
            }

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

        [NonAction]
        private async Task<ActionResult> getPreview(Guid versionId)
        {
            var pageversion = await db.PageVersions.FindAsync(versionId);
            if (pageversion == null)
            {
                return HttpNotFound();
            }
            return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
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