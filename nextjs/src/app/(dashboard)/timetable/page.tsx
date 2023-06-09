import React from "react";
import styles from "@app/(dashboard)/timetable/timetable.module.css";
import SearchBar from "@/components/dashboard/SearchBar";

export default function timetable() {
    // var schedule = {
    //     initialize: function() {
    //         schedule.activities.set();
    //     },
    //     options: {
    //         schedule: "#schedule",
    //         breaks: [5, 5, 10, 20, 10, 20, 10, 5, 5], // breaks duration
    //         s_breaks: [475, 525, 575, 630, 695, 750, 815, 870, 920], // the time after which the break begins
    //         lesson_time: 45, // lesson duration (minutes)
    //         lessons: 9, // number of lessons per week
    //         start: function() {
    //             // start at 7.10
    //             return schedule.general.toMin(7, 10);
    //         },
    //         end: function() {
    //             // start at 16.10
    //             return schedule.general.toMin(16, 10);
    //         },
    //         h_width: $(".s-hour-row").width(), // get a width of hour div
    //         minToPx: function() {
    //             // divide the box width by the duration of one lesson
    //             return schedule.options.h_width / schedule.options.lesson_time;
    //         }
    //     },
    //     general: {
    //         hoursRegEx: function(hours) {
    //             var regex = /([0-9]{1,2}).([0-9]{1,2})-([0-9]{1,2}).([0-9]{1,2})/;
    //             if (regex.test(hours)) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         },
    //         toMin: function(hours, minutes, string) {
    //             // change time format (10,45) to minutes (645)
    //             if (!string) {
    //                 return hours * 60 + minutes;
    //             }

    //             if (string.length > 0) {
    //                 // "7.10"
    //                 var h = parseInt(string.split(".")[0]),
    //                     m = parseInt(string.split(".")[1]);

    //                 return schedule.general.toMin(h, m);
    //             }
    //         },
    //         getPosition: function(start, duration, end) {
    //             var translateX =
    //                 (start - schedule.options.start()) * schedule.options.minToPx(),
    //                 width = duration * schedule.options.minToPx(),
    //                 breaks = schedule.options.breaks,
    //                 s_breaks = schedule.options.s_breaks;

    //             $.each(breaks, function(index, item) {
    //                 if (
    //                     start < s_breaks[index] &&
    //                     duration > item &&
    //                     end > s_breaks[index] + item
    //                 ) {
    //                     width -= item * schedule.options.minToPx();
    //                 }
    //                 if (
    //                     start > s_breaks[index] &&
    //                     duration > item &&
    //                     end > s_breaks[index] + item
    //                 ) {
    //                     translateX -= item * schedule.options.minToPx();
    //                 }
    //             });

    //             return [translateX, width];
    //         }
    //     },
    //     activities: {
    //         find: function(week, hours, id) { },
    //         delete: function(week, hours) {
    //             /* week: 0-4 << remove all activities from a day 
    //   hours: "7.10-16.10" << remove all activities from a choosed hours
    //   */
    //             function finalize(message) {
    //                 if (confirm(message)) {
    //                     return true;
    //                 }
    //             }

    //             if (week && !hours) {
    //                 if (
    //                     finalize("Do you want to delete all activities on the selected day?")
    //                 ) {
    //                     $(".s-activities .s-act-row:eq(" + week + ")").empty();
    //                 }
    //             }

    //             if (!week && !hours) {
    //                 console.log(
    //                     'Error. You have to add variables like a week (0-4) or hours ("9.10-10.45")!'
    //                 );
    //             }
    //             // if day is not defined and hours has got a correct form
    //             if (!week && schedule.general.hoursRegEx(hours)) {
    //                 console.log("Week not defined and hours are defined!");

    //                 $(schedule.options.schedule + " .s-act-tab").each(function(i, v) {
    //                     var t = $(this), // get current tab
    //                         name = t.children(".s-act-name").text(), // get tab name
    //                         h = t.attr("data-hours").split("-"), // get tab hours
    //                         s = schedule.general.toMin(0, 0, h[0]), // get tab start time (min)
    //                         e = schedule.general.toMin(0, 0, h[1]), // get tab end time (min)
    //                         uh = hours.split("-"), // user choosed time
    //                         us = schedule.general.toMin(0, 0, uh[0]), // user choosed start time (min)
    //                         ue = schedule.general.toMin(0, 0, uh[1]); // user choosed end time (min)

    //                     if (us <= s && ue >= e) {
    //                         $(this).remove();
    //                     }
    //                 });
    //             }

    //             if (week && hours) {
    //                 // if week and hours is defined
    //                 console.log("Week is defined and hours are defined too!");

    //                 $("#schedule .s-act-row:eq(" + week + ") .s-act-tab").each(function(
    //                     i,
    //                     v
    //                 ) {
    //                     var t = $(this), // get current tab
    //                         name = t.children(".s-act-name").text(), // get tab name
    //                         h = t.attr("data-hours").split("-"), // get tab hours
    //                         s = schedule.general.toMin(0, 0, h[0]), // get tab start time (min)
    //                         e = schedule.general.toMin(0, 0, h[1]), // get tab end time (min)
    //                         uh = hours.split("-"), // user choosed time
    //                         us = schedule.general.toMin(0, 0, uh[0]), // user choosed start time (min)
    //                         ue = schedule.general.toMin(0, 0, uh[1]); // user choosed end time (min)

    //                     if (us <= s && ue >= e) {
    //                         $(this).remove();
    //                     }
    //                 });
    //             }
    //         },
    //         add: function(week, lesson, hours, classroom, group, teacher, color) {
    //             /* EXAMPLES --> week: 0-4, lesson: "Math", hours: "9.45-12.50", 
    //    classroom: 145, group: "A", teacher: "A. Badurski", color: "orange" */
    //             var tab =
    //                 "<div className='s-act-tab " +
    //                 color +
    //                 "' data-hours='" +
    //                 hours +
    //                 "'>\
    //          <div className={styles['s-act-name']}>" +
    //                 lesson +
    //                 "</div>\
    //          <div className={styles['s-wrapper']}>\
    //          <div className={styles['s-act-teacher']}>" +
    //                 teacher +
    //                 "</div>\
    //          <div className={styles['s-act-room']}>" +
    //                 classroom +
    //                 "</div>\
    //          <div className={styles['s-act-group']}>" +
    //                 group +
    //                 "</div>\
    //          </div>\
    //          </div>";
    //             $(".s-activities .s-act-row:eq(" + week + ")").append(tab);
    //             schedule.activities.set();
    //         },
    //         set: function() {
    //             $(schedule.options.schedule + " .s-act-tab").each(function(i) {
    //                 var hours = $(this).attr("data-hours").split("-"),
    //                     start =
    //              /* HOURS */ parseInt(hours[0].split(".")[0] * 60) +
    //              /* MINUTES */ parseInt(hours[0].split(".")[1]),
    //                     end =
    //              /* HOURS */ parseInt(hours[1].split(".")[0] * 60) +
    //              /* MINUTES */ parseInt(hours[1].split(".")[1]),
    //                     duration = end - start,
    //                     translateX = schedule.general.getPosition(start, duration, end)[0],
    //                     width = schedule.general.getPosition(start, duration, end)[1];

    //                 $(this)
    //                     .attr({ "data-start": start, "data-end": end })
    //                     .css({
    //                         transform: "translateX(" + translateX + "px)",
    //                         width: width + "px"
    //                     });
    //             });
    //         }
    //     }
    // };

    // schedule.initialize();

    return (
        <div className={styles['projects-section']}>
            <div className={styles['DM_Sans']}>
                <div className={styles['header']}>
                    <div className={styles['inside-header']}>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>0800</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>1000</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>1200</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>1400</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>1600</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>1800</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>2000</div>
                        </div>
                        <div className={styles['s-head-hour']}>
                            <div className={styles['s-hourly-interval']}>2200</div>
                        </div>
                    </div>
                </div>
                <div className={styles['schedule']}>
                    <div className={styles['s-legend']}>
                        <div className={`${styles['s-week-day']} ${styles['s-cell']}`}>
                            <div className={styles['s-day']}>Mon</div>
                        </div>
                        <div className={`${styles['s-week-day']} ${styles['s-cell']}`}>
                            <div className={styles['s-day']}>Tue</div>
                        </div>
                        <div className={`${styles['s-week-day']} ${styles['s-cell']}`}>
                            <div className={styles['s-day']}>Wed</div>
                        </div>
                        <div className={`${styles['s-week-day']} ${styles['s-cell']}`}>
                            <div className={styles['s-day']}>Thu</div>
                        </div>
                        <div className={`${styles['s-week-day']} ${styles['s-cell']}`}>
                            <div className={styles['s-day']}>Fri</div>
                        </div>
                    </div>
                    <div className={`${styles['s-container']} ${styles['s-block']}`}>
                        <div className={styles['s-rows-container']}>
                            <div className={styles['s-activities']}>
                                <div className={styles['s-act-row']}>
                                    <div className={`${styles['s-act-tab']} ${styles['green']}`} data-hours='7.32-8.45'>
                                        <div className={styles['s-act-name']}>English</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>A. Rygulska</div>
                                            <div className={styles['s-act-room']}>105</div>
                                            <div className={styles['s-act-group']}>G1</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['s-act-tab']} ${styles['orange']}`} data-hours='9.45-12.50'>
                                        <div className={styles['s-act-name']}>Math</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>D. Kozlowicz</div>
                                            <div className={styles['s-act-room']}>121</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['s-act-tab']} ${styles['green']}`} data-hours='13.45-14.30'>
                                        <div className={styles['s-act-name']}>Math</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>D. Kozlowicz</div>
                                            <div className={styles['s-act-room']}>121</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['s-act-row']}>
                                    <div className={`${styles['s-act-tab']} ${styles['blue']}`} data-hours='8.50-10.08'>
                                        <div className={styles['s-act-name']}>Exam</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>A. Rygulska</div>
                                            <div className={styles['s-act-room']}>105</div>
                                            <div className={styles['s-act-group']}>G1</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['s-act-tab']} ${styles['black']}`} data-hours='10.50-12.30'>
                                        <div className={styles['s-act-name']}>Math</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>D. Kozlowicz</div>
                                            <div className={styles['s-act-room']}>121</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['s-act-tab']} ${styles['orange']}`} data-hours='14.15-15.20'>
                                        <div className={styles['s-act-name']}>Fitness</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>D. Kozlowicz</div>
                                            <div className={styles['s-act-room']}>121</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['s-act-row']} />
                                <div className={styles['s-act-row']}>
                                    <div className={`${styles['s-act-tab']} ${styles['blue']}`} data-hours='7.10-7.55'>
                                        <div className={styles['s-act-name']}>English</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>A. Rygulska</div>
                                            <div className={styles['s-act-room']}>105</div>
                                            <div className={styles['s-act-group']}>G1</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['s-act-tab']} ${styles['red']}`} data-hours='8.23-9.35'>
                                        <div className={styles['s-act-name']}>Deutsch</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>D. Kozlowicz</div>
                                            <div className={styles['s-act-room']}>121</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['s-act-tab']} ${styles['pink']}`} data-hours='15.05-16.10'>
                                        <div className={styles['s-act-name']}>Bio</div>
                                        <div className={styles['s-wrapper']}>
                                            <div className={styles['s-act-teacher']}>D. Kozlowicz</div>
                                            <div className={styles['s-act-room']}>121</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['s-act-row']} />
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']} ${styles['gray-col']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']} ${styles['gray-col']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']} ${styles['gray-col']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                            <div className={`${styles['s-row']} ${styles['s-hour-row']} ${styles['gray-col']}`}>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                                <div className={`${styles['s-hour-wrapper']} ${styles['s-cell']}`}>
                                    <div className={styles['s-half-hour']} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['module-field']}>
                <SearchBar width="1500px" />
            </div>
        </div>

    );
}
