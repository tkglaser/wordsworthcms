using com.vorwardit.jollyapp.cms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Collections;
using System.Web.Caching;

namespace com.vorwardit.jollyapp.cms.Engine
{
    public class DbPathProvider : VirtualPathProvider
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        private List<DbCacheDependency> dependencyCache = new List<DbCacheDependency>();

        private bool IsDbDirectory(string virtualPath)
        {
            return virtualPath.StartsWith("/db/");
        }

        private bool IsEditMode(string virtualPath)
        {
            return virtualPath.Contains("/edit/");
        }

        private Guid? GetViewGuid(string virtualPath)
        {
            var guidStr = virtualPath.Replace("/db/", "").Replace("edit/", "").Replace(".cshtml", "");
            Guid id;
            if (Guid.TryParse(guidStr, out id))
            {
                return id;
            }
            return null;
        }

        public override bool FileExists(string virtualPath)
        {
            if (IsDbDirectory(virtualPath))
            {
                return GetViewGuid(virtualPath).HasValue;
            }
            return base.FileExists(virtualPath);
        }

        public override VirtualFile GetFile(string virtualPath)
        {
            if (IsDbDirectory(virtualPath))
            {
                Guid id = GetViewGuid(virtualPath).Value;
                var pageVersion = (from pv in db.PageVersions.Include("Page")
                                   where pv.PageVersionId == id
                                   select pv).FirstOrDefault();

                if (pageVersion != null)
                {
                    var content = "@inherits System.Web.Mvc.WebViewPage" + Environment.NewLine;
                    content += "@using com.vorwardit.jollyapp.cms.Modules.Core;";
                    content += "@using System.Web.Mvc.Html;";
                    content += $"@{{Layout=\"/db/{pageVersion.Page.PageLayoutId}.cshtml\";" +
                        $"ViewBag.PageVersionId=\"{pageVersion.PageVersionId}\";" +
                        $"ViewBag.Title=\"{pageVersion.Title}\";" +
                        $"ViewBag.MetaDescription=\"{pageVersion.MetaDescription}\";";
                    if (IsEditMode(virtualPath))
                    {
                        content += "ViewBag.EditMode=true;";
                    }
                    content += "}";
                    if (IsEditMode(virtualPath))
                    {
                        content += $"@Html.Action(\"PageEditor\",\"Module\", new {{ pageVersionId=\"{id.ToString()}\" }})";
                    }
                    //content += pageVersion.Body;
                    return new DbVirtualFile(virtualPath, content);
                }

                var pageLayout = (from pl in db.PageLayouts
                                  where pl.PageLayoutId == id
                                  select pl).FirstOrDefault();

                if (pageLayout != null)
                {
                    var content = "@inherits System.Web.Mvc.WebViewPage" + Environment.NewLine;
                    content += "@using com.vorwardit.jollyapp.cms.Modules.Core;";
                    content += $"@{{Layout=\"/db/{pageLayout.LayoutId}.cshtml\";}}";
                    content += pageLayout.Body;

                    return new DbVirtualFile(virtualPath, content);
                }

                var layout = (from l in db.Layouts
                              where l.LayoutId == id
                              select l).FirstOrDefault();

                if (layout != null)
                {
                    var content = "@inherits System.Web.Mvc.WebViewPage" + Environment.NewLine;
                    content += "@using com.vorwardit.jollyapp.cms.Modules.Core;";
                    content += layout.Body;

                    return new DbVirtualFile(virtualPath, content);
                }
            }
            return base.GetFile(virtualPath);
        }

        public void InvalidateCache()
        {
            var separatearray = dependencyCache.ToArray();
            foreach(var dependency in separatearray)
            {
                dependency.Invalidate();
            }
            db = new ApplicationDbContext();
        }

        public override CacheDependency GetCacheDependency(string virtualPath, IEnumerable virtualPathDependencies, DateTime utcStart)
        {
            if (IsDbDirectory(virtualPath))
            {
                var dbc = new DbCacheDependency((dependency) => 
                {
                    dependencyCache.Remove(dependency);
                });
                dependencyCache.Add(dbc);
                return dbc;
            }
            else
            {
                return base.GetCacheDependency(virtualPath, virtualPathDependencies, utcStart); ;
            }
        }
    }
}