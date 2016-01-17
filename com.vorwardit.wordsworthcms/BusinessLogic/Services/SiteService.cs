using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using com.vorwardit.wordsworthcms.Models;
using System.Threading.Tasks;
using System.Data.Entity;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Services
{
    public class SiteService : ISiteService
    {
        private ApplicationDbContext db;

        public SiteService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<IList<Site>> GetAllAsync()
        {
            return await db.Sites.ToListAsync();
        }

        public async Task<Site> GetByHostnameAsync(string hostname)
        {
            return (await db.Sites.ToListAsync()).FirstOrDefault(s => s.Bindings.Contains(hostname));
        }

        public async Task<Site> GetAsync(Guid id)
        {
            return await db.Sites.SingleAsync(l => l.SiteId == id);
        }

        public async Task<Site> GetOrCreateAsync(Guid id)
        {
            var site = await db.Sites.FirstOrDefaultAsync(l => l.SiteId == id);
            if (site == null)
            {
                site = new Site();
            }
            return site;
        }

        public async Task UpdateAsync(Site site)
        {
            if (site.SiteId == Guid.Empty)
            {
                db.Sites.Add(site);
            }
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var site = await db.Sites.FindAsync(id);
            if (site != null)
            {
                db.Sites.Remove(site);
                await db.SaveChangesAsync();
            }
        }
    }
}