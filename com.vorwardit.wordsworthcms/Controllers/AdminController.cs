using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {
        ISiteService siteService;

        public AdminController(ISiteService siteService)
        {
            this.siteService = siteService;
        }

        // GET: Admin
        public async Task<ActionResult> Index()
        {
			ViewBag.DefaultSiteId = (await siteService.GetByHostnameAsync(Request.Url.DnsSafeHost))?.SiteId;
            return View();
        }
    }
}