using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Controllers
{
    public class PageEditorController : Controller
    {
        // GET: PageEditor
        public ActionResult Index()
        {
            return PartialView();
        }
    }
}