using AutoMapper;
using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/layouts")]
    public class PageLayoutsController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
            return Ok(await (from l in db.PageLayouts
                             where l.Layout.SiteId == siteId
                             orderby l.Name
                             select new
                             {
                                 l.PageLayoutId,
                                 l.LayoutId,
                                 l.Name
                             }).ToListAsync());
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid id)
        {
            return Ok(Mapper.Map<PageLayoutViewModel>(await db.PageLayouts.SingleAsync(pl => pl.PageLayoutId == id)));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageLayoutViewModel model)
        {
            PageLayout pageLayout;
            if (model.PageLayoutId == Guid.Empty)
            {
                pageLayout = new PageLayout();
                pageLayout.PageLayoutId = Guid.NewGuid();
                db.PageLayouts.Add(pageLayout);
            }
            else
            {
                pageLayout = await db.PageLayouts.FindAsync(model.PageLayoutId);
            }
            pageLayout.LayoutId = model.LayoutId;
            pageLayout.Name = model.Name;
            pageLayout.Body = model.Body;
            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache(pageLayout.PageLayoutId);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            var pageLayout = await db.PageLayouts.FindAsync(id);
            if (pageLayout != null)
            {
                db.PageLayouts.Remove(pageLayout);
                await db.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
