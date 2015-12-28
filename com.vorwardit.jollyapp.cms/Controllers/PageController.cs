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
        public ActionResult Index(string id)
        {
            var page = (from url in db.PageUrls
                        where url.Url == id
                        where url.Page.SiteId == CurrentSite.SiteId
                        select url.Page).FirstOrDefault();
            var pageversion = (from pv in page.Versions
                               where pv.Status == Models.PageVersionStatus.Published
                               orderby pv.RevisionNumber descending
                               select pv).FirstOrDefault();
            return View($"/db/{pageversion.PageVersionId.ToString()}.cshtml");
        }
    }
}