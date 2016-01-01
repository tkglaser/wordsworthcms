using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace com.vorwardit.jollyapp.cms.Modules
{
    public static class ModuleHelper
    {
        public static MvcHtmlString Module(this HtmlHelper helper, string position)
        {
            string pageVersionId = helper.ViewBag.PageVersionId;
            var actionresult = helper.Action("Index", "TopBanner");
            string injection = "";
            if (helper.ViewBag.EditMode == true)
            {
                injection = "<div style='position:relative'><button class='cmsEditButton'>Bearbeiten</button></div>";
            }
            return MvcHtmlString.Create(injection + actionresult.ToString());
        }
    }
}



