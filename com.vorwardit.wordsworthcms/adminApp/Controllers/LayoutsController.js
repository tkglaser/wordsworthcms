﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('LayoutsController', LayoutsController);

    LayoutsController.$inject = ['$location', 'LayoutsFactory']; 

    function LayoutsController($location, LayoutsFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'LayoutsController';
        vm.modalHeadingNew = 'Neues Layout anlegen';
        vm.modalHeadingEdit = 'Layout bearbeiten';
        vm.modalHeading = vm.modalHeadingEdit;
        vm.layouts = [];
        vm.layout = {};

        activate();

        function activate() {
            LayoutsFactory.getData().success(function (data) {
                vm.layouts = data;
            });
        }
        vm.create = function () {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingNew;
            vm.layout = {};
            vm.layout.name = '';
            vm.layout.body = '';
            $('#editModal').modal();
        };

        vm.edit = function (layout) {
            $('#saveError').hide();
            vm.modalHeading = vm.modalHeadingEdit;
            vm.layout = {};
            vm.layout.layoutId = layout.layoutId;
            vm.layout.name = layout.name;
            vm.layout.body = layout.body;
            $('#editModal').modal();
        };

        vm.delete = function (layout) {
            $('#deleteError').hide();
            vm.layout = layout;
            $('#deleteModal').modal();
        }

        vm.deleteConfirmed = function () {
            LayoutsFactory.remove(vm.layout.layoutId).then(function () {
                $('#deleteModal').modal('hide');
                activate();
            },
            function () {
                $('#deleteError').show();
            })
        }

        vm.save = function () {
            var data = {
                LayoutId: vm.layout.layoutId,
                Name: vm.layout.name,
                Body: vm.layout.body
            }
            LayoutsFactory.update(data).then(function () {
                $('#editModal').modal("hide");
                activate();
            },
            function () {
                $('#saveError').show();
            });
        }
    }
})();