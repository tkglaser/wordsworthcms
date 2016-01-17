using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.BusinessLogic.Services;
using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Models;
using Microsoft.Practices.Unity;
using System;
using System.Web.Http;
using Unity.WebApi;

namespace com.vorwardit.wordsworthcms
{
    public static class UnityConfig
    {
        /// <summary>Registers the type mappings with the Unity container.</summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>There is no need to register concrete types such as controllers or API controllers (unless you want to 
        /// change the defaults), as Unity allows resolving a concrete type even if it was not previously registered.</remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below. Make sure to add a Microsoft.Practices.Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your types here
            // container.RegisterType<IProductRepository, ProductRepository>();
            container.RegisterType<ApplicationDbContext>();
            container.RegisterType<IAzureStorageService, AzureStorageService>();
            container.RegisterType<ISiteService, SiteService>();
            container.RegisterType<IPageService, PageService>();
            container.RegisterType<IContentService, ContentService>();
            container.RegisterType<ILayoutService, LayoutService>();
            container.RegisterType<IPageLayoutService, PageLayoutService>();
        }

        public static void RegisterComponents()
        {
			var container = new UnityContainer();

            RegisterTypes(container);

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }

        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        /// <summary>
        /// Gets the configured Unity container.
        /// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion
    }
}