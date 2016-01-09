﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    [Authorize]
    public class AdminController : BaseController
    {
        // GET: Admin
        public ActionResult Index()
        {
            ViewBag.DefaultSiteId = CurrentSite?.SiteId;
            return View();
        }
    }
}