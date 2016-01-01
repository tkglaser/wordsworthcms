using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Modules
{
    public class TopBannerController : Controller
    {
        // GET: TopBanner
        public ActionResult Index()
        {
            return PartialView();
        }
    }
}