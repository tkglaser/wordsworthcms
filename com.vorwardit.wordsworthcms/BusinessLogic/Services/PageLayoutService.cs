using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Services
{
    public class PageLayoutService : IPageLayoutService
    {
        private ApplicationDbContext db;

        public PageLayoutService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<PageLayout> GetAsync(Guid id)
        {
            return await db.PageLayouts.SingleAsync(l => l.PageLayoutId == id);
        }

        public async Task<PageLayout> GetOrCreateAsync(Guid id)
        {
            var layout = await db.PageLayouts.FirstOrDefaultAsync(l => l.PageLayoutId == id);
            if (layout == null)
            {
                layout = new PageLayout();
            }
            return layout;
        }

        public async Task<IList<PageLayout>> GetBySiteIdAsync(Guid siteId)
        {
            return await (from l in db.PageLayouts
                          where l.Layout.SiteId == siteId
                          orderby l.Name
                          select l).ToListAsync();
        }

        public async Task UpdateAsync(PageLayout layout)
        {
            if (layout.PageLayoutId == Guid.Empty)
            {
                db.PageLayouts.Add(layout);
            }
            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache(layout.PageLayoutId);
        }

        public async Task DeleteAsync(Guid id)
        {
            var layout = await db.PageLayouts.FindAsync(id);
            if (layout != null)
            {
                db.PageLayouts.Remove(layout);
                await db.SaveChangesAsync();
                DbPathProviderSingleton.Instance.InvalidateCache(layout.PageLayoutId);
            }
        }
    }
}