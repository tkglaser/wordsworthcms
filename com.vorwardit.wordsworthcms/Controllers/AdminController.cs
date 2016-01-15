using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    [Authorize]
    public class AdminController : BaseController
    {
        // GET: Admin
        public ActionResult Index()
        {
			ViewBag.ApplicationNameLong = WebConfigurationManager.AppSettings["ApplicationNameLong"];
			ViewBag.ApplicationNameShort = WebConfigurationManager.AppSettings["ApplicationNameShort"];
			ViewBag.DefaultSiteId = CurrentSite?.SiteId;
            return View();
        }
    }
}