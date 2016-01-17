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
    [RoutePrefix("api/page")]
    public class PageController : ApiController
    {
        IPageService pageService;

        public PageController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
            var pages = await pageService.GetBySiteIdAsync(siteId);
            return Ok(pages.Select(p => Mapper.Map<PageViewModel>(p)));
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid id)
        {
            return Ok(Mapper.Map<PageViewModel>(await pageService.GetAsync(id)));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageViewModel model)
        {
            await pageService.UpdateAsync(model.PageId, model.PageLayoutId, model.Name, model.Urls.Select(u => u.Url).ToArray());
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            await pageService.DeleteAsync(id);
            return Ok();
        }
    }
}
