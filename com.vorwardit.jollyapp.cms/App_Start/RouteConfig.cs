﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace com.vorwardit.jollyapp.cms
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Admin",
                url: "admin",
                defaults: new { controller = "Admin", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Preview",
                url: "preview/{id}",
                defaults: new { controller = "Page", action = "Preview" }
            );

            routes.MapRoute(
                name: "Edit",
                url: "edit/{id}",
                defaults: new { controller = "Page", action = "Edit" }
            );

            routes.MapRoute(
                name: "CmsContent",
                url: "{*pathinfo}",
                defaults: new { controller = "Page", action = "Index" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
