using AutoMapper;
using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
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
    [RoutePrefix("api/layout")]
    public class PageLayoutController : ApiController
    {
        IPageLayoutService pageLayoutService;

        public PageLayoutController(IPageLayoutService pageLayoutService)
        {
            this.pageLayoutService = pageLayoutService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
            var pageLayouts = await pageLayoutService.GetBySiteIdAsync(siteId);
            return Ok(from l in pageLayouts
                      select new
                      {
                          l.PageLayoutId,
                          l.LayoutId,
                          l.Name
                      });
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid id)
        {
            return Ok(Mapper.Map<PageLayoutViewModel>(await pageLayoutService.GetAsync(id)));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageLayoutViewModel model)
        {
            PageLayout pageLayout = await pageLayoutService.GetOrCreateAsync(model.PageLayoutId);
            pageLayout.LayoutId = model.LayoutId;
            pageLayout.Name = model.Name;
            pageLayout.Body = model.Body;
            await pageLayoutService.UpdateAsync(pageLayout);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            await pageLayoutService.DeleteAsync(id);
            return Ok();
        }
    }
}
