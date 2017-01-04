$(function() {
    // takes a JS-representation of a task and generates HTML with li-tags for it
    function createTaskHTML(task) {
        var isChecked = task.done ? "checked" : "";
        var liElement = '<li><div class="view"><input class="toggle" type="checkbox"' +
                                ' data-id="' + task.id + '" '+
                                isChecked + '><label>' +
                                task.title +
                                '</label></div></li>';

        return liElement;
    }
    // called when a checkbox is toggled: will send the toggle-status to DB via JSON &
    // a put request
    function toggleTask(e) {
        var itemID = $(e.target).data("id");

        var isItemDone = Boolean($(e.target).is(':checked'));

        $.post("/tasks/" +itemID, {
            _method: "PUT",
            task: {
                done: isItemDone
            }
        });
    }

    $.get("/tasks").success( function( data ) {
        var htmlString = "";

        $.each(data, function(index, task) {
            htmlString += createTaskHTML(task);
        });

        var ulTodos = $('.todo-list');
        ulTodos.html(htmlString);

        $('.toggle').change(toggleTask);
    });

    $('#new-form').submit(function(e) {
        e.preventDefault();

        var text = $('.new-todo').val();

        var payload = {
            task: {
                title: text
            }
        };
        $.post("/tasks", payload).success(function(data) {
            var htmlString = createTaskHTML(data);

            var ulTodos = $('.todo-list');
            ulTodos.append(htmlString);

            $('.toggle').click(toggleTask);
        });
    });
});