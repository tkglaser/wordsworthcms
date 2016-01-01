using com.vorwardit.jollyapp.cms.Models;
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
            var db = new ApplicationDbContext();

            string pageVersionId = helper.ViewBag.PageVersionId;
            Guid pvGuid = Guid.Parse(pageVersionId);
            var pageVersion = db.PageVersions.Find(pvGuid);
            MvcHtmlString actionresult = MvcHtmlString.Create("");
            var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
            if (moduledata != null)
            {
                switch(moduledata.Type)
                {
                    case "imagebanner":
                        actionresult = helper.Action("Index", "ImageBanner", new { pageVersionId = pageVersionId, position = position });
                        break;

                    case "content":
                        actionresult = MvcHtmlString.Create(moduledata.Data);
                        break;
                }
            }

            string injection = "";
            if (helper.ViewBag.EditMode == true)
            {
                injection = "<div class='cmsEditButtonWrapper'><button class='cmsEditButton'>Bearbeiten</button></div>";
            }
            return MvcHtmlString.Create(injection + actionresult.ToString());
        }
    }
}



