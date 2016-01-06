using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace com.vorwardit.wordsworthcms.Modules.Core
{
    public static class ModuleHelper
    {
        public static MvcHtmlString Module(this HtmlHelper helper, string position)
        {
            if (helper.ViewBag.EditMode == true)
            {
                return MvcHtmlString.Create($"<div data-module data-position='{position}'><div data-content></div><div data-editor></div></div>");
            }

            return helper.Action("RenderModule", "Module", new
            {
                pageVersionId = helper.ViewBag.PageVersionId,
                position = position
            });
        }
    }
}



