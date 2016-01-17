using AutoMapper;
using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms
{
    public class AutoMapperConfig
    {
        public static void ConfigureMappings()
        {
            Mapper.CreateMap<Site, SiteViewModel>();
            Mapper.CreateMap<Layout, LayoutViewModel>();
            Mapper.CreateMap<PageLayout, PageLayoutViewModel>();
            Mapper.CreateMap<Page, PageViewModel>()
                .ForMember(dest => dest.Urls, opts => opts.MapFrom(
                    src => (from u in src.Urls
                            select new UrlViewModel { Url = u.Url }).ToArray()));
            Mapper.AssertConfigurationIsValid();
        }
    }
}