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
    public class LayoutController : ApiController
    {
        ILayoutService layoutService;

        public LayoutController(ILayoutService layoutService)
        {
            this.layoutService = layoutService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
            var layouts = await layoutService.GetBySiteIdAsync(siteId);
            return Ok(
                from l in layouts
                select new
                {
                    l.LayoutId,
                    l.Name,
                    l.SiteId
                });
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid id)
        {
            return Ok(Mapper.Map<LayoutViewModel>(await layoutService.GetAsync(id)));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(LayoutViewModel model)
        {
            Layout layout = await layoutService.GetOrCreateAsync(model.LayoutId);
            layout.Name = model.Name;
            layout.Body = model.Body;
            layout.SiteId = model.SiteId;
            await layoutService.UpdateAsync(layout);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            await layoutService.DeleteAsync(id);
            return Ok();
        }
    }
}
