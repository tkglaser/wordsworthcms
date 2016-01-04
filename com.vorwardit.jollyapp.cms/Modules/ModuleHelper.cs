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
            if (helper.ViewBag.EditMode == true)
            {
                return MvcHtmlString.Create($"<div data-module data-position='{position}'><div data-editor></div><div data-content></div></div>");
                    //"<div class='cmsEditButtonWrapper'><button class='cmsEditButton'>Bearbeiten</button></div>");
            }

            return helper.Action("RenderModule", "Module", new
            {
                pageVersionId = helper.ViewBag.PageVersionId,
                position = position
            });
        }
    }
}



