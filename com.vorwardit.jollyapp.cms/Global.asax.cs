using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Modules.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace com.vorwardit.wordsworthcms
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            HostingEnvironment.RegisterVirtualPathProvider(DbPathProviderSingleton.Instance);
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
			ModuleFinder.Init();
        }
    }
}
