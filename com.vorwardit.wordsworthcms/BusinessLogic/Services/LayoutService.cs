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
    public class LayoutService : ILayoutService
    {
        private ApplicationDbContext db;

        public LayoutService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<Layout> GetAsync(Guid id)
        {
            return await db.Layouts.SingleAsync(l => l.LayoutId == id);
        }

        public async Task<Layout> GetOrCreateAsync(Guid id)
        {
            var layout = await db.Layouts.FirstOrDefaultAsync(l => l.LayoutId == id);
            if (layout == null)
            {
                layout = new Layout();
            }
            return layout;
        }

        public async Task<IList<Layout>> GetBySiteIdAsync(Guid siteId)
        {
            return await (from l in db.Layouts
                          where l.SiteId == siteId
                          orderby l.Name
                          select l).ToListAsync();
        }

        public async Task UpdateAsync(Layout layout)
        {
            if (layout.LayoutId == Guid.Empty)
            {
                layout.LayoutId = Guid.NewGuid();
                db.Layouts.Add(layout);
            }
            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache(layout.LayoutId);
        }

        public async Task DeleteAsync(Guid id)
        {
            var layout = await db.Layouts.FindAsync(id);
            if (layout != null)
            {
                db.Layouts.Remove(layout);
                await db.SaveChangesAsync();
                DbPathProviderSingleton.Instance.InvalidateCache(layout.LayoutId);
            }
        }
    }
}