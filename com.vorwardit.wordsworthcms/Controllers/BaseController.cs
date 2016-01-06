using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public abstract class BaseController : Controller
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        protected Site CurrentSite { get; private set; }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var host = Request.Url.DnsSafeHost;

            CurrentSite = db.Sites.ToList().FirstOrDefault(s => s.Bindings.Contains(host));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}