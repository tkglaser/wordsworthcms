using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Controllers
{
    public class PageController : BaseController
    {
        // GET: Page
        public ActionResult Index(string pathinfo)
        {
            var path = "/" + pathinfo;

            var page = (from url in db.PageUrls
                        where url.Url == path
                        where url.Page.SiteId == CurrentSite.SiteId
                        select url.Page).FirstOrDefault();
            if (page == null)
            {
                // is it a content?
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
            var pageversion = (from pv in page.Versions
                               //where pv.Status == Models.PageVersionStatus.Published
                               orderby pv.RevisionNumber descending
                               select pv).FirstOrDefault();
            if (pageversion == null)
            {
                return HttpNotFound();
            }
            return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
        }
    }
}