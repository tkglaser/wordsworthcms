using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using com.vorwardit.wordsworthcms.Models;
using System.Threading.Tasks;
using System.Data.Entity;
using com.vorwardit.wordsworthcms.Engine;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Services
{
    public class PageService : IPageService
    {
        private ApplicationDbContext db;

        public PageService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public PageVersion GetPageVersion(Guid id)
        {
            return db.PageVersions.Find(id);
        }

        public async Task<PageVersion> GetPageVersionAsync(Guid id)
        {
            return await db.PageVersions.FindAsync(id);
        }

        public async Task<IList<PageVersion>> GetPageVersionsByPageIdAsync(Guid pageId)
        {
            return await (from pv in db.PageVersions
                          where pv.PageId == pageId
                          orderby pv.RevisionNumber descending
                          select pv).ToListAsync();
        }

        public async Task<PageVersion> GetLatestPublishedVersionAsync(Guid siteId, string path)
        {
            if (path == null)
            {
                path = string.Empty;
            }
            if (!path.StartsWith("/"))
            {
                path = "/" + path;
			}
            var page = await (from url in db.PageUrls
                              where url.Page.PageLayout.Layout.SiteId == siteId
							  where url.Url == path || (url.Url.EndsWith("*") && path.StartsWith(url.Url.Replace("*", "")))
							  select url.Page).FirstOrDefaultAsync();
            if (page == null)
            {
                return null;
            }
            return (from pv in page.Versions
                    where pv.Status == PageVersionStatus.Published
                    orderby pv.RevisionNumber descending
                    select pv).FirstOrDefault();
        }

        public async Task<PageVersion> GetErrorPageAsync(Guid siteId, int errorCode)
        {
            var path = "/errors/" + errorCode.ToString();

            var page = await (from url in db.PageUrls
                              where url.Url == path
                              where url.Page.PageLayout.Layout.SiteId == siteId
                              select url.Page).FirstOrDefaultAsync();
            if (page == null)
            {
                return null;
            }
            var pageversion = (from pv in page.Versions
                               where pv.Status == Models.PageVersionStatus.Published
                               orderby pv.RevisionNumber descending
                               select pv).FirstOrDefault();
            return pageversion;
        }

        public async Task<Page> GetAsync(Guid id)
        {
            return await db.Pages.Include(p => p.PageLayout).SingleOrDefaultAsync(p => p.PageId == id);
        }

        public async Task<Page> GetOrCreateAsync(Guid id)
        {
            var page = await db.Pages.FirstOrDefaultAsync(p => p.PageId == id);
            if (page == null)
            {
                page = new Page();
                page.Urls = new HashSet<PageUrl>();
            }
            return page;
        }

        public async Task<IList<Page>> GetBySiteIdAsync(Guid siteId)
        {
            return await (from l in db.Pages.Include(path => path.PageLayout)
                          where l.PageLayout.Layout.SiteId == siteId
                          orderby l.Name
                          select l).ToListAsync();
        }

        public async Task UpdateAsync(PageVersion pv)
        {
            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache(pv.PageVersionId);
        }

        public async Task UpdateLatestVersionAsync(PageVersion pageVersion)
        {
            Page page;
            page = await db.Pages.FindAsync(pageVersion.PageId);
            var version = (from pv in page.Versions
                           orderby pv.RevisionNumber descending
                           select pv).FirstOrDefault();

            if (version == null)
            {
                version = new PageVersion
                {
                    PageVersionId = Guid.NewGuid(),
                    PageId = pageVersion.PageId,
                    RevisionNumber = 1,
                    Status = PageVersionStatus.Draft
                };
                db.PageVersions.Add(version);
            }
            else if (version.Status == PageVersionStatus.Published)
            {
                var newVersion = new PageVersion
                {
                    PageVersionId = Guid.NewGuid(),
                    PageId = pageVersion.PageId,
                    RevisionNumber = version.RevisionNumber + 1,
                    Status = PageVersionStatus.Draft,
                    Body = version.Body
                };
                version = newVersion;
                db.PageVersions.Add(version);
            }

            version.MetaDescription = pageVersion.MetaDescription;
            version.Title = pageVersion.Title;

            await db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid pageId, Guid pageLayoutId, string name, string[] urls)
        {
            var page = await db.Pages.FirstOrDefaultAsync(p => p.PageId == pageId);
            if (page == null)
            {
                page = new Page();
                page.PageId = Guid.NewGuid();
                page.Urls = new HashSet<PageUrl>();
				db.Pages.Add(page);
            }
            page.PageLayoutId = pageLayoutId;
            page.Name = name;
            db.PageUrls.RemoveRange(page.Urls);
            foreach (var url in urls)
            {
                page.Urls.Add(new PageUrl
                {
                    Url = url
                });
            }
            await db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Page page)
        {
            if (page.PageId == Guid.Empty)
            {
                page.PageId = Guid.Empty;
                db.Pages.Add(page);
            }
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var page = await db.Pages.FindAsync(id);
            if (page != null)
            {
                db.Pages.Remove(page);
                await db.SaveChangesAsync();
                DbPathProviderSingleton.Instance.InvalidateCache(page.PageId);
            }
        }

        public async Task Publish(Guid pageVersionId)
        {
            var page = await (from v in db.PageVersions
                              where v.PageVersionId == pageVersionId
                              select v.Page).SingleOrDefaultAsync();
            foreach (var v in page.Versions)
            {
                if (v.PageVersionId == pageVersionId)
                {
                    v.Status = PageVersionStatus.Published;
                }
                else
                {
                    v.Status = PageVersionStatus.Draft;
                }
            }
            await db.SaveChangesAsync();
        }

        public async Task CreateNewVersionAsync(Guid pageId)
        {
            PageVersion newVersion;
            var currentVersion = await (from v in db.PageVersions
                                        where v.PageId == pageId
                                        orderby v.RevisionNumber descending
                                        select v).FirstOrDefaultAsync();
            if (currentVersion == null)
            {
                newVersion = new PageVersion
                {
                    PageVersionId = Guid.NewGuid(),
                    PageId = pageId,
                    RevisionNumber = 1,
                    Status = PageVersionStatus.Draft
                };
            }
            else
            {
                newVersion = new PageVersion
                {
                    PageVersionId = Guid.NewGuid(),
                    PageId = pageId,
                    RevisionNumber = currentVersion.RevisionNumber + 1,
                    Status = PageVersionStatus.Draft,
                    Body = currentVersion.Body,
                    Title = currentVersion.Title,
                    MetaDescription = currentVersion.MetaDescription
                };
            }
            db.PageVersions.Add(newVersion);
            await db.SaveChangesAsync();
        }
    }
}